#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> t(n);
    for (int i = 0; i < n; i++) cin >> t[i];
    int mx = *max_element(t.begin(), t.end());
    int first = -1, last = -1;
    for (int i = 0; i < n; i++) {
        if (t[i] == mx) {
            if (first == -1) first = i + 1;
            last = i + 1;
        }
    }
    cout << mx << ' ' << first << ' ' << last << '\n';
    return 0;
}
