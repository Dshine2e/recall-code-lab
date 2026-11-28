#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 0;
    vector<long long> a(n);
    long long total = 0;
    for (auto &x : a) { if (scanf("%lld", &x) != 1) return 0; total += x; }
    if (total % 3 != 0) { puts("0"); return 0; }
    long long t = total / 3;
    vector<long long> pre(n + 1, 0);
    for (int i = 1; i <= n; i++) pre[i] = pre[i - 1] + a[i - 1];
    long long ans = 0, cntFirst = 0;
    for (int j = 2; j <= n - 1; j++) {
        if (pre[j - 1] == t) cntFirst++;
        if (pre[j] == 2 * t) ans += cntFirst;
    }
    printf("%lld\n", ans);
    return 0;
}
