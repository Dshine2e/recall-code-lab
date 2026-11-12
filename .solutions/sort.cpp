#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<pair<int, int>> a(n);
    for (auto& [x, y] : a) cin >> x >> y;
    sort(a.begin(), a.end(), [](const auto& p, const auto& q) {
        return p.first != q.first ? p.first < q.first : p.second > q.second;
    });
    for (auto& [x, y] : a) cout << x << ' ' << y << '\n';
}
