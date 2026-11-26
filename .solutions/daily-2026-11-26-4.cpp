#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    unordered_map<long long, int> last;
    last.reserve(n * 2 + 1);
    int bestD = INT_MAX;
    long long bestV = -1;
    for (int i = 1; i <= n; i++) {
        long long v;
        cin >> v;
        auto it = last.find(v);
        if (it != last.end()) {
            int d = i - it->second;
            if (d < bestD || (d == bestD && v < bestV)) { bestD = d; bestV = v; }
            it->second = i;
        } else {
            last[v] = i;
        }
    }
    if (bestD == INT_MAX) cout << -1 << '\n';
    else cout << bestD << ' ' << bestV << '\n';
    return 0;
}
