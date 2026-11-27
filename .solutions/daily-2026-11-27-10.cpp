#include <bits/stdc++.h>
using namespace std;

int main() {
    string a, b;
    cin >> a >> b;
    int n = a.size(), m = b.size();
    vector<vector<int>> suf(n + 2, vector<int>(m + 2, 0));
    for (int i = n - 1; i >= 0; i--)
        for (int j = m - 1; j >= 0; j--)
            suf[i][j] = (a[i] == b[j]) ? suf[i + 1][j + 1] + 1 : max(suf[i + 1][j], suf[i][j + 1]);
    int i = 0, j = 0, need = suf[0][0];
    string ans;
    while (need > 0) {
        for (char c = 'a'; c <= 'z'; c++) {
            int x = i;
            while (x < n && a[x] != c) x++;
            int y = j;
            while (y < m && b[y] != c) y++;
            if (x < n && y < m && suf[x + 1][y + 1] == need - 1) {
                ans += c;
                i = x + 1;
                j = y + 1;
                need--;
                break;
            }
        }
    }
    cout << ans.size() << '\n';
    if (!ans.empty()) cout << ans << '\n';
    return 0;
}
