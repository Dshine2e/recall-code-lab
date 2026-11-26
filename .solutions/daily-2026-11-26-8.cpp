#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    cin >> n >> m;
    vector<vector<int>> adj(n + 1);
    for (int i = 0; i < m; i++) {
        int a, b;
        cin >> a >> b;
        adj[a].push_back(b);
        adj[b].push_back(a);
    }
    vector<int> color(n + 1, -1), q(n);
    long long answer = 0;
    for (int s = 1; s <= n; s++) {
        if (color[s] != -1) continue;
        int head = 0, tail = 0;
        q[tail++] = s;
        color[s] = 0;
        int c[2] = {0, 0};
        while (head < tail) {
            int u = q[head++];
            c[color[u]]++;
            for (int v : adj[u]) {
                if (color[v] == -1) {
                    color[v] = 1 - color[u];
                    q[tail++] = v;
                } else if (color[v] == color[u]) {
                    cout << "불가능\n";
                    return 0;
                }
            }
        }
        answer += min(c[0], c[1]);
    }
    cout << "가능\n" << answer << '\n';
    return 0;
}
