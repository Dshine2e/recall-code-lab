#include <bits/stdc++.h>
using namespace std;

int main() {
    int cap[2], cur[2] = {0, 0}, n;
    cin >> cap[0] >> cap[1] >> n;
    long long used = 0;
    for (int i = 0; i < n; i++) {
        string op, x;
        cin >> op >> x;
        int a = x[0] - 'A';
        if (op == "FILL") {
            used += cap[a] - cur[a];
            cur[a] = cap[a];
        } else if (op == "EMPTY") {
            cur[a] = 0;
        } else {
            string y;
            cin >> y;
            int b = y[0] - 'A';
            int mv = min(cur[a], cap[b] - cur[b]);
            cur[a] -= mv;
            cur[b] += mv;
        }
    }
    cout << cur[0] << ' ' << cur[1] << '\n' << used << '\n';
    return 0;
}
