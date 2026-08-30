#!/usr/bin/env python3
"""Precompute symptom network outputs from YSQsymptom1.csv."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Dict, List

import networkx as nx
import numpy as np
import pandas as pd
from scipy import stats
from sklearn.covariance import GraphicalLassoCV


EXPECTED_COLUMNS = [
    "F1",
    "D1",
    "D2",
    "C1",
    "A1",
    "A2",
    "A3",
    "A4",
    "A5",
    "F2",
    "F3",
    "F4",
    "E1",
    "E2",
    "E3",
    "E4",
    "C2",
    "C3",
    "C4",
    "F5",
    "C5",
    "F6",
    "F7",
    "B1",
    "B2",
    "B3",
    "B4",
]

SYMPTOM_LABELS = [
    "疲乏",
    "头晕",
    "头痛",
    "发热",
    "注意力难以集中",
    "反应变慢",
    "健忘",
    "理解上存在困难",
    "变得更加糊涂",
    "咳嗽",
    "嗜睡或难以入睡",
    "视力模糊",
    "皮疹",
    "口腔溃疡",
    "肌肉关节疼痛",
    "手脚发麻",
    "食欲下降",
    "腹胀腹痛腹泻",
    "恶心呕吐",
    "脂肪堆积",
    "消瘦体重减轻",
    "性欲下降",
    "掉发",
    "感到无法控制焦虑",
    "感到紧张或焦虑",
    "做事提不起兴趣",
    "感到心情低落",
]

GROUP_TO_INDEX = {
    "认知症状": [5, 6, 7, 8, 9],
    "心理症状": [24, 25, 26, 27],
    "消化症状": [4, 17, 18, 19, 21],
    "神经症状": [2, 3],
    "皮肤关节症状": [13, 14, 15, 16],
    "全身症状": [1, 10, 11, 12, 20, 22, 23],
}

GROUP_COLORS = {
    "认知症状": "#E69F00",
    "心理症状": "#56B4E9",
    "消化症状": "#009E73",
    "神经症状": "#F0E442",
    "皮肤关节症状": "#CC79A7",
    "全身症状": "#0072B2",
}

EDGE_THRESHOLD = 0.03
SIM_N_SAMPLES = 5000
RANDOM_SEED = 20260325


def to_float(value: float, digits: int = 6) -> float:
    return float(np.round(float(value), digits))


def write_json(path: Path, payload: object) -> None:
    with path.open("w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)


def load_input_data(csv_path: Path) -> pd.DataFrame:
    df = pd.read_csv(csv_path)
    if set(EXPECTED_COLUMNS) - set(df.columns):
        missing = sorted(set(EXPECTED_COLUMNS) - set(df.columns))
        raise ValueError(f"输入 CSV 缺少列: {missing}")
    df = df[EXPECTED_COLUMNS].copy()
    df = df.fillna(0)
    for col in EXPECTED_COLUMNS:
        df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0)
    return df


def build_group_lookup() -> Dict[int, str]:
    lookup: Dict[int, str] = {}
    for group_name, one_indexed_positions in GROUP_TO_INDEX.items():
        for pos in one_indexed_positions:
            lookup[pos - 1] = group_name
    if len(lookup) != len(SYMPTOM_LABELS):
        raise ValueError("分组定义未覆盖全部症状。")
    return lookup


def fit_precision_with_spearman(df: pd.DataFrame) -> tuple[np.ndarray, np.ndarray, float]:
    spearman_corr = df.corr(method="spearman").to_numpy(dtype=float)
    rank_df = df.rank(axis=0, method="average")
    rank_std = rank_df.std(axis=0, ddof=0).replace(0, 1.0)
    rank_z = (rank_df - rank_df.mean(axis=0)) / rank_std
    model = GraphicalLassoCV(cv=5, max_iter=1000)
    model.fit(rank_z.to_numpy(dtype=float))
    return spearman_corr, model.precision_, float(model.alpha_)


def precision_to_partial_corr(precision: np.ndarray) -> np.ndarray:
    diag = np.diag(precision)
    denom = np.sqrt(np.outer(diag, diag))
    partial = -precision / denom
    np.fill_diagonal(partial, 0.0)
    return np.clip(partial, -1.0, 1.0)


def threshold_matrix(matrix: np.ndarray, minimum_abs: float) -> np.ndarray:
    out = matrix.copy()
    out[np.abs(out) < minimum_abs] = 0.0
    np.fill_diagonal(out, 0.0)
    return out


def build_network(partial_corr: np.ndarray) -> tuple[nx.Graph, List[dict]]:
    graph = nx.Graph()
    for name in SYMPTOM_LABELS:
        graph.add_node(name)

    edges: List[dict] = []
    p = len(SYMPTOM_LABELS)
    for i in range(p):
        for j in range(i + 1, p):
            weight = float(partial_corr[i, j])
            if weight == 0.0:
                continue
            src = SYMPTOM_LABELS[i]
            dst = SYMPTOM_LABELS[j]
            abs_w = abs(weight)
            graph.add_edge(src, dst, weight=weight, distance=1.0 / abs_w)
            edges.append(
                {
                    "source": src,
                    "target": dst,
                    "weight": to_float(weight),
                    "is_negative": bool(weight < 0),
                }
            )
    return graph, edges


def compute_centrality(graph: nx.Graph) -> Dict[str, Dict[str, float]]:
    strength: Dict[str, float] = {}
    for node in graph.nodes:
        strength[node] = sum(abs(data["weight"]) for _, _, data in graph.edges(node, data=True))

    closeness = nx.closeness_centrality(graph, distance="distance")
    betweenness = nx.betweenness_centrality(graph, weight="distance", normalized=True)

    metrics: Dict[str, Dict[str, float]] = {}
    for name in SYMPTOM_LABELS:
        metrics[name] = {
            "strength": to_float(strength.get(name, 0.0)),
            "closeness": to_float(closeness.get(name, 0.0)),
            "betweenness": to_float(betweenness.get(name, 0.0)),
        }
    return metrics


def rank_centrality(metrics: Dict[str, Dict[str, float]]) -> List[dict]:
    ordered = sorted(
        SYMPTOM_LABELS,
        key=lambda name: (
            metrics[name]["strength"],
            metrics[name]["closeness"],
            metrics[name]["betweenness"],
        ),
        reverse=True,
    )

    rankings: List[dict] = []
    for rank, name in enumerate(ordered, start=1):
        rankings.append(
            {
                "name": name,
                "strength": metrics[name]["strength"],
                "closeness": metrics[name]["closeness"],
                "betweenness": metrics[name]["betweenness"],
                "rank": rank,
            }
        )
    return rankings


def fdr_bh_adjust(p_values: List[float]) -> List[float]:
    arr = np.asarray(p_values, dtype=float)
    arr = np.where(np.isfinite(arr), arr, 1.0)
    n = arr.size
    order = np.argsort(arr)
    ranked = arr[order]
    adjusted = np.empty(n, dtype=float)
    min_so_far = 1.0
    for idx in range(n - 1, -1, -1):
        rank = idx + 1
        value = ranked[idx] * n / rank
        value = min(value, min_so_far, 1.0)
        adjusted[idx] = value
        min_so_far = value
    out = np.empty(n, dtype=float)
    out[order] = adjusted
    return [float(v) for v in out]


def run_intervention_simulation(
    values: np.ndarray,
    precision: np.ndarray,
    n_samples: int,
    rng: np.random.Generator,
) -> tuple[List[dict], List[dict], float]:
    mu = values.mean(axis=0)
    sd = values.std(axis=0, ddof=0)
    obs_min = values.min(axis=0)
    obs_max = values.max(axis=0)

    covariance = np.linalg.inv(precision)
    baseline_samples = rng.multivariate_normal(mean=mu, cov=covariance, size=n_samples)
    baseline_burden = baseline_samples.sum(axis=1)
    baseline_mean = float(np.mean(baseline_burden))

    simulation_rows: List[dict] = []
    p_values: List[float] = []
    spillover_map = {
        "alleviate": np.zeros((len(SYMPTOM_LABELS), len(SYMPTOM_LABELS)), dtype=float),
        "aggravate": np.zeros((len(SYMPTOM_LABELS), len(SYMPTOM_LABELS)), dtype=float),
    }

    for i, symptom in enumerate(SYMPTOM_LABELS):
        mask = np.ones(len(SYMPTOM_LABELS), dtype=bool)
        mask[i] = False
        omega_oo = precision[np.ix_(mask, mask)]
        omega_oi = precision[mask, i]
        sigma_cond = np.linalg.inv(omega_oo)
        adjustment_vector = sigma_cond @ omega_oi

        for intervention_type, sign in (("alleviate", -1.0), ("aggravate", 1.0)):
            x_star = float(mu[i] + sign * 2.0 * sd[i])
            valid = bool(obs_min[i] <= x_star <= obs_max[i])

            mu_cond = mu[mask] - adjustment_vector * (x_star - mu[i])
            sampled_other = rng.multivariate_normal(mean=mu_cond, cov=sigma_cond, size=n_samples)

            sampled_full = np.empty((n_samples, len(SYMPTOM_LABELS)), dtype=float)
            sampled_full[:, mask] = sampled_other
            sampled_full[:, i] = x_star

            intervened_burden = sampled_full.sum(axis=1)
            intervened_mean = float(np.mean(intervened_burden))
            sem = float(np.std(intervened_burden, ddof=1) / np.sqrt(n_samples))
            ci_95 = [intervened_mean - 1.96 * sem, intervened_mean + 1.96 * sem]

            t_result = stats.ttest_ind(intervened_burden, baseline_burden, equal_var=False, nan_policy="omit")
            p_value = float(t_result.pvalue) if np.isfinite(t_result.pvalue) else 1.0

            pct_change = 0.0
            if baseline_mean != 0:
                pct_change = (intervened_mean - baseline_mean) / baseline_mean * 100.0

            effect_vector = sampled_full.mean(axis=0) - mu
            effect_vector[i] = 0.0
            spillover_map[intervention_type][i, :] = effect_vector

            simulation_rows.append(
                {
                    "node_id": symptom,
                    "intervention_type": intervention_type,
                    "baseline_burden": to_float(baseline_mean),
                    "intervened_burden": to_float(intervened_mean),
                    "pct_change": to_float(pct_change),
                    "p_value": to_float(p_value),
                    "p_adjusted": None,
                    "ci_95": [to_float(ci_95[0]), to_float(ci_95[1])],
                    "valid": valid,
                }
            )
            p_values.append(p_value)

    p_adjusted = fdr_bh_adjust(p_values)
    for row, p_adj in zip(simulation_rows, p_adjusted):
        row["p_adjusted"] = to_float(p_adj)

    spillover_payload = []
    for intervention_type in ("alleviate", "aggravate"):
        matrix = spillover_map[intervention_type]
        spillover_payload.append(
            {
                "intervention_type": intervention_type,
                "node_names": SYMPTOM_LABELS,
                "matrix": [[to_float(v) for v in row] for row in matrix],
            }
        )

    return simulation_rows, spillover_payload, baseline_mean


def main() -> None:
    project_root = Path(__file__).resolve().parents[1]
    input_csv = project_root / "doc" / "YSQsymptom1.csv"
    data_dir = project_root / "data"
    data_dir.mkdir(parents=True, exist_ok=True)

    df = load_input_data(input_csv)
    spearman_corr, precision, best_alpha = fit_precision_with_spearman(df)
    partial_corr = precision_to_partial_corr(precision)
    partial_corr_thr = threshold_matrix(partial_corr, EDGE_THRESHOLD)

    graph, edges = build_network(partial_corr_thr)
    centrality = compute_centrality(graph)
    rankings = rank_centrality(centrality)

    group_lookup = build_group_lookup()
    frequency = (df.to_numpy(dtype=float) > 0).sum(axis=0)

    nodes = []
    for idx, symptom in enumerate(SYMPTOM_LABELS):
        group = group_lookup[idx]
        nodes.append(
            {
                "id": symptom,
                "label": symptom,
                "centrality": centrality[symptom],
                "frequency": int(frequency[idx]),
                "group": group,
                "group_color": GROUP_COLORS[group],
            }
        )

    graph_payload = {"nodes": nodes, "edges": edges}
    centrality_payload = {"rankings": rankings}

    values = df.to_numpy(dtype=float)
    simulation_payload, spillover_payload, baseline_mean = run_intervention_simulation(
        values=values,
        precision=precision,
        n_samples=SIM_N_SAMPLES,
        rng=np.random.default_rng(RANDOM_SEED),
    )

    graph_path = data_dir / "sn_graph.json"
    centrality_path = data_dir / "sn_centrality.json"
    simulation_path = data_dir / "sn_simulation.json"
    spillover_path = data_dir / "sn_spillover.json"

    write_json(graph_path, graph_payload)
    write_json(centrality_path, centrality_payload)
    write_json(simulation_path, simulation_payload)
    write_json(spillover_path, spillover_payload)

    n_nodes = len(SYMPTOM_LABELS)
    n_edges = len(edges)
    density = 0.0 if n_nodes <= 1 else (2.0 * n_edges) / (n_nodes * (n_nodes - 1))
    n_significant = sum(1 for row in simulation_payload if row["p_adjusted"] < 0.05)
    mean_abs_spearman = float(np.mean(np.abs(spearman_corr[np.triu_indices(n_nodes, k=1)])))

    print("=== 症状网络预计算完成 ===")
    print(f"输入文件: {input_csv}")
    print(f"样本量: {df.shape[0]}, 症状数: {n_nodes}")
    print(f"GraphicalLassoCV 最优 alpha: {best_alpha:.6f}")
    print(f"Spearman 平均绝对相关: {mean_abs_spearman:.6f}")
    print(f"阈值后边数: {n_edges}, 网络密度: {density:.4f}")
    print(f"基线总症状负担均值(仿真): {baseline_mean:.4f}")
    print(f"仿真结果显著项(FDR<0.05): {n_significant}/{len(simulation_payload)}")
    print("输出文件:")
    print(f"  - {graph_path}")
    print(f"  - {centrality_path}")
    print(f"  - {simulation_path}")
    print(f"  - {spillover_path}")


if __name__ == "__main__":
    main()
