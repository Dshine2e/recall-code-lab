#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<vector<long long>> T(n, vector<long long>(n));
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++) cin >> T[i][j];
    vector<int> pre(n, 0);
    for (int i = 0; i < n; i++) {
        int k;
        cin >> k;
        while (k--) {
            int x;
            cin >> x;
            pre[i] |= 1 << (x - 1);
        }
    }
    const long long INF = LLONG_MAX / 4;
    int full = (1 << n) - 1;
    // best[mask][last]: mask 의 별을 모두 보고 마지막으로 last 를 본 상태의 최소 시간 (당겨 오는 방식)
    vector<vector<long long>> best(1 << n, vector<long long>(n, INF));
    for (int mask = 1; mask <= full; mask++) {
        for (int last = 0; last < n; last++) {
            if (!((mask >> last) & 1)) continue;
            int before = mask ^ (1 << last);
            if ((pre[last] & before) != pre[last]) continue;  // 선행 별을 다 보지 못함
            if (before == 0) {
                best[mask][last] = 0;
                continue;
            }
            long long v = INF;
            for (int prev = 0; prev < n; prev++) {
                if (!((before >> prev) & 1)) continue;
                if (best[before][prev] >= INF) continue;
                v = min(v, best[before][prev] + T[prev][last]);
            }
            best[mask][last] = v;
        }
    }
    long long ans = INF;
    for (int last = 0; last < n; last++) ans = min(ans, best[full][last]);
    cout << (ans >= INF ? -1 : ans) << '\n';
    return 0;
}
