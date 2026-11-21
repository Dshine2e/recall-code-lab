#include <bits/stdc++.h>
using namespace std;
int main() {
    int n; cin >> n;
    for (int r = 1; r <= 2 * n - 1; r++) {
        int k = n - abs(n - r);
        string s(n - k, ' ');
        for (int j = 1; j <= k; j++) s += char('0' + j % 10);
        for (int j = k - 1; j >= 1; j--) s += char('0' + j % 10);
        cout << s << "\n";
    }
}
