#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, k;
    cin >> n >> k;
    map<long long, int> delta;
    for (int i = 0; i < n; i++) {
        long long s, e;
        cin >> s >> e;
        delta[s]++;
        delta[e]--;
    }
    long long total = 0, last = 0;
    int cover = 0;
    for (auto &[x, d] : delta) {
        if (cover >= k) total += x - last;
        cover += d;
        last = x;
    }
    cout << total << '\n';
    return 0;
}
