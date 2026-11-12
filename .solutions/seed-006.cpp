#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<pair<int, int>> a(n);
    for (auto &p : a) cin >> p.first >> p.second;
    sort(a.begin(), a.end(), [](const pair<int, int> &x, const pair<int, int> &y) {
        if (x.first != y.first) return x.first < y.first;
        return x.second > y.second;
    });
    vector<int> best;  // best[k] = 길이 k+1 인 줄의 마지막 높이 중 가장 작은 값
    for (auto &p : a) {
        auto it = lower_bound(best.begin(), best.end(), p.second);
        if (it == best.end()) best.push_back(p.second);
        else *it = p.second;
    }
    cout << best.size() << '\n';
    return 0;
}
