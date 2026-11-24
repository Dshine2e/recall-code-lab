#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, k;
    cin >> n >> k;
    vector<int> h(n);
    for (auto &x : h) cin >> x;
    vector<int> peaks;
    for (int i = 0; i < n; i++) {
        bool ok = h[i] >= k;
        if (i > 0 && h[i] <= h[i - 1]) ok = false;
        if (i + 1 < n && h[i] <= h[i + 1]) ok = false;
        if (ok) peaks.push_back(i + 1);
    }
    cout << peaks.size() << "\n";
    for (size_t i = 0; i < peaks.size(); i++) cout << peaks[i] << (i + 1 < peaks.size() ? ' ' : '\n');
    return 0;
}
