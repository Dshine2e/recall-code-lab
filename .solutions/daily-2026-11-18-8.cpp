#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<long long> pos(n + 2, 0);  // pos[k] = 1번에서 k번 정류장까지 시계 방향 거리
    long long circle = 0;
    for (int i = 1; i <= n; i++) {
        long long d;
        cin >> d;
        circle += d;
        if (i < n) pos[i + 1] = pos[i] + d;
    }
    int q;
    cin >> q;
    string out;
    while (q--) {
        int a, b;
        cin >> a >> b;
        long long one = llabs(pos[a] - pos[b]);
        out += to_string(min(one, circle - one));
        out += '\n';
    }
    cout << out;
    return 0;
}
