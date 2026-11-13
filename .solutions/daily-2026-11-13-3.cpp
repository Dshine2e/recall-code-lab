#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<long long> a(n + 1);
    for (int i = 1; i <= n; i++) cin >> a[i];
    vector<vector<int>> ch(n + 1);
    for (int i = 2; i <= n; i++) {
        int p;
        cin >> p;
        ch[p].push_back(i);
    }
    vector<int> order;
    order.reserve(n);
    order.push_back(1);
    for (size_t k = 0; k < order.size(); k++)
        for (int c : ch[order[k]]) order.push_back(c);
    vector<long long> tk(n + 1, 0), sk(n + 1, 0);
    for (int k = (int)order.size() - 1; k >= 0; k--) {
        int v = order[k];
        tk[v] = a[v];
        for (int c : ch[v]) {
            tk[v] += sk[c];
            sk[v] += max(tk[c], sk[c]);
        }
    }
    cout << max(tk[1], sk[1]) << '\n';
    return 0;
}
