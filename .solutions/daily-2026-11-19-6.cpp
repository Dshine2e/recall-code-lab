#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    cin >> n >> m;
    vector<long long> leave(n), arrive(n);
    for (int i = 0; i < n; i++) {
        long long p;
        cin >> arrive[i] >> p;
        leave[i] = arrive[i] + p;
    }
    vector<int> ans(n, 0);
    int head = 0;
    for (int j = 1; j <= m; j++) {
        long long b;
        int c;
        cin >> b >> c;
        while (c > 0 && head < n && arrive[head] <= b) {
            if (leave[head] >= b) {
                ans[head] = j;
                c--;
            }
            head++;
        }
    }
    for (int i = 0; i < n; i++) cout << ans[i] << (i + 1 < n ? ' ' : '\n');
    return 0;
}
