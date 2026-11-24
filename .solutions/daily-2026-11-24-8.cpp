#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int k;
    cin >> k;
    int n = 1 << k;
    vector<long long> hp(n);
    for (auto &x : hp) cin >> x;
    vector<int> wins(n, 0), cur(n);
    iota(cur.begin(), cur.end(), 0);
    while (cur.size() > 1) {
        vector<int> nxt;
        for (size_t i = 0; i < cur.size(); i += 2) {
            int a = cur[i], b = cur[i + 1];
            // 체력이 같으면 번호가 작은 a 가 이긴다 (a < b)
            int w = hp[a] >= hp[b] ? a : b;
            int l = w == a ? b : a;
            hp[w] -= hp[l];
            wins[w]++;
            nxt.push_back(w);
        }
        cur = nxt;
    }
    cout << cur[0] + 1 << "\n";
    for (int i = 0; i < n; i++) cout << wins[i] << (i + 1 < n ? ' ' : '\n');
    return 0;
}
