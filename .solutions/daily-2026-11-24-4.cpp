#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, k;
    cin >> n >> k;
    vector<pair<int, int>> st;  // (색, 연속 개수)
    for (int i = 0; i < n; i++) {
        int c;
        cin >> c;
        if (!st.empty() && st.back().first == c) st.back().second++;
        else st.push_back({c, 1});
        if (st.back().second == k) st.pop_back();
    }
    vector<int> rest;
    for (auto &p : st)
        for (int j = 0; j < p.second; j++) rest.push_back(p.first);
    cout << rest.size() << "\n";
    for (size_t i = 0; i < rest.size(); i++) cout << rest[i] << (i + 1 < rest.size() ? ' ' : '\n');
    return 0;
}
