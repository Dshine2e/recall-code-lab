#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, m;
    cin >> n >> m;
    vector<int> order(n);
    iota(order.begin(), order.end(), 1);
    for (int i = 0; i < m; i++) {
        int l, r; cin >> l >> r;
        reverse(order.begin() + (l - 1), order.begin() + r);
    }
    for (int i = 0; i < n; i++) cout << (i ? " " : "") << order[i];
    cout << '\n';
}
