#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, m, k;
    if (scanf("%d %d %d", &n, &m, &k) != 3) return 0;
    vector<int> d(n + 2, 0);
    for (int i = 0; i < m; i++) {
        int l, r;
        if (scanf("%d %d", &l, &r) != 2) return 0;
        if (l <= r) { d[l]++; d[r + 1]--; }
        else { d[l]++; d[n + 1]--; d[1]++; d[r + 1]--; }
    }
    int cur = 0, best = 0, cnt = 0;
    for (int i = 1; i <= n; i++) {
        cur += d[i];
        best = max(best, cur);
        if (cur >= k) cnt++;
    }
    printf("%d\n%d\n", best, cnt);
    return 0;
}
