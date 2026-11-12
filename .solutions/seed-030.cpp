#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    unordered_map<int, int> groupOf;
    groupOf.reserve(n * 2);
    vector<vector<int>> groups;
    string w;
    for (int i = 1; i <= n; i++) {
        cin >> w;
        int mask = 0;
        for (char c : w) mask |= 1 << (c - 'a');
        auto it = groupOf.find(mask);
        if (it == groupOf.end()) {
            groupOf[mask] = (int)groups.size();
            groups.push_back({i});
        } else {
            groups[it->second].push_back(i);
        }
    }
    string out = to_string(groups.size()) + "\n";
    for (auto &g : groups) {
        for (size_t j = 0; j < g.size(); j++) {
            if (j) out += ' ';
            out += to_string(g[j]);
        }
        out += '\n';
    }
    fwrite(out.data(), 1, out.size(), stdout);
    return 0;
}
