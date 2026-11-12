#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, m;
    long long k;
    if (scanf("%d %d %lld", &n, &m, &k) != 3) return 0;
    // 0-based 차분: d[l-1] += w, d[r] -= w (크기 n+1)
    vector<long long> d(n + 1, 0);
    for (int i = 0; i < m; i++) {
        int l, r;
        long long w;
        scanf("%d %d %lld", &l, &r, &w);
        d[l - 1] += w;
        d[r] -= w;
    }
    long long run = 0, mx = LLONG_MIN;
    int cnt = 0;
    for (int i = 0; i < n; i++) {
        run += d[i];
        cnt += (run >= k);
        mx = max(mx, run);
    }
    printf("%d\n%lld\n", cnt, mx);
    return 0;
}
