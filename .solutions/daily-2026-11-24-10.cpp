#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<long long> x(n), y(n), cost(n);
    for (int i = 0; i < n; i++) cin >> x[i] >> y[i] >> cost[i];
    // 정점 0..n-1 과 가상 정점(우주 본부)을 둔 프림. 처음 거리 = 위성 비용
    vector<char> used(n, 0);
    long long total = 0;
    for (int step = 0; step < n; step++) {
        int v = -1;
        for (int i = 0; i < n; i++)
            if (!used[i] && (v < 0 || cost[i] < cost[v])) v = i;
        used[v] = 1;
        total += cost[v];
        for (int i = 0; i < n; i++)
            if (!used[i]) cost[i] = min(cost[i], llabs(x[i] - x[v]) + llabs(y[i] - y[v]));
    }
    cout << total << "\n";
    return 0;
}
