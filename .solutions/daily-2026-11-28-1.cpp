#include <bits/stdc++.h>
using namespace std;

int main() {
    int a, b, p, q, w;
    cin >> a >> b >> p >> q >> w;
    vector<pair<int,int>> res;
    for (int x = 0; x <= p; x++)
        for (int y = 0; y <= q; y++)
            if (a * x + b * y == w) res.push_back({x, y});
    printf("%d\n", (int)res.size());
    for (auto &r : res) printf("%d %d\n", r.first, r.second);
    return 0;
}
