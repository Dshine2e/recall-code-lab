#include <bits/stdc++.h>
using namespace std;
int main() {
    int r, c;
    cin >> r >> c;
    vector<string> g(r);
    for (auto& s : g) cin >> s;
    for (int i = 0; i < r; i++) {
        string row(c, '0');
        for (int j = 0; j < c; j++) {
            if (g[i][j] == '*') { row[j] = '*'; continue; }
            int k = 0;
            for (int di = -1; di <= 1; di++)
                for (int dj = -1; dj <= 1; dj++) {
                    if (!di && !dj) continue;
                    int ni = i + di, nj = j + dj;
                    if (ni >= 0 && ni < r && nj >= 0 && nj < c && g[ni][nj] == '*') k++;
                }
            row[j] = char('0' + k);
        }
        cout << row << "\n";
    }
    return 0;
}
