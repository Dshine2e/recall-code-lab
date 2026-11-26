#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, k;
    cin >> n >> k;
    vector<long long> s(n + 1);
    for (int i = 1; i <= n; i++) cin >> s[i];
    // 키: (점수, -점프 수) 가 클수록 좋은 상태
    vector<pair<long long, int>> best(n + 1);
    best[1] = {s[1], 0};
    deque<int> dq;
    dq.push_back(1);
    for (int i = 2; i <= n; i++) {
        while (dq.front() < i - k) dq.pop_front();
        auto b = best[dq.front()];
        best[i] = {b.first + s[i], b.second - 1};
        while (!dq.empty() && best[dq.back()] <= best[i]) dq.pop_back();
        dq.push_back(i);
    }
    cout << best[n].first << ' ' << -best[n].second << '\n';
    return 0;
}
