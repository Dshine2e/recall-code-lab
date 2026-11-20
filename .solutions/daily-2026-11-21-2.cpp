#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, k;
    cin >> n >> k;
    map<string, int> cnt;
    for (int i = 0; i < n; i++) {
        string s;
        cin >> s;
        cnt[s]++;
    }
    vector<pair<int, string>> v;
    for (auto &e : cnt)
        if (e.second >= k) v.push_back({-e.second, e.first});
    sort(v.begin(), v.end());
    if (v.empty()) cout << "NONE\n";
    for (auto &e : v) cout << e.second << ' ' << -e.first << '\n';
    return 0;
}
