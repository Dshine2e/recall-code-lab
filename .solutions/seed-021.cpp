#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<int> a(n);
    for (auto &x : a) cin >> x;
    vector<int> v = a;
    sort(v.begin(), v.end());
    v.erase(unique(v.begin(), v.end()), v.end());
    int d = (int)v.size();
    string out;
    out.reserve((size_t)n * 7);
    for (int i = 0; i < n; i++) {
        int pos = (int)(lower_bound(v.begin(), v.end(), a[i]) - v.begin());  // 오름차순 위치
        if (i) out += ' ';
        out += to_string(d - pos);
    }
    out += '\n';
    cout << out;
    return 0;
}
