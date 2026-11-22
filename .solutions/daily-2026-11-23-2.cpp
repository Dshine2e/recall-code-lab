#include <bits/stdc++.h>
using namespace std;
long long g(long long a, long long b) { while (b) { long long t = a % b; a = b; b = t; } return a; }
int main() {
    int n; cin >> n;
    vector<long long> w(n), h(n);
    long long all = 0;
    for (int i = 0; i < n; i++) {
        cin >> w[i] >> h[i];
        long long t = g(w[i], h[i]);
        cout << t << ' ' << (w[i] / t) * (h[i] / t) << '\n';
        all = g(all, t);
    }
    long long total = 0;
    for (int i = 0; i < n; i++) total += (w[i] / all) * (h[i] / all);
    cout << all << ' ' << total << '\n';
}
