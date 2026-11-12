#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    cin >> n >> m;
    vector<int> a(n), b(m);
    for (auto &x : a) cin >> x;
    for (auto &x : b) cin >> x;
    sort(a.begin(), a.end());
    a.erase(unique(a.begin(), a.end()), a.end());
    sort(b.begin(), b.end());
    b.erase(unique(b.begin(), b.end()), b.end());
    // 정렬된 두 배열을 병합하며 센다
    size_t i = 0, j = 0;
    long long both = 0, onlyA = 0, onlyB = 0;
    while (i < a.size() && j < b.size()) {
        if (a[i] == b[j]) { both++; i++; j++; }
        else if (a[i] < b[j]) { onlyA++; i++; }
        else { onlyB++; j++; }
    }
    onlyA += a.size() - i;
    onlyB += b.size() - j;
    cout << both << ' ' << both + onlyA + onlyB << ' ' << onlyA << ' ' << onlyB << '\n';
    return 0;
}
