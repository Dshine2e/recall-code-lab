#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<pair<int, int>> v(n);
    for (int i = 0; i < n; i++) {
        cin >> v[i].first;
        v[i].second = i + 1;
    }
    sort(v.begin(), v.end());
    int same = 0;
    for (int i = 0; i < n; i++) {
        if (i) cout << ' ';
        cout << v[i].second;
        if (v[i].second == i + 1) same++;
    }
    cout << '\n' << same << '\n';
    return 0;
}
