#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<long long> t(n + 1);
    for (int i = 1; i <= n; i++) cin >> t[i];
    vector<vector<int>> ch(n + 1);
    for (int i = 2; i <= n; i++) {
        int p;
        cin >> p;
        ch[p].push_back(i);
    }
    vector<long long> ans(n + 1, 0);
    queue<int> q;
    q.push(1);
    while (!q.empty()) {
        int v = q.front();
        q.pop();
        for (int c : ch[v]) {
            ans[c] = ans[v] + t[v];
            q.push(c);
        }
    }
    string out;
    for (int i = 1; i <= n; i++) {
        if (i > 1) out += ' ';
        out += to_string(ans[i]);
    }
    cout << out << '\n';
    return 0;
}
