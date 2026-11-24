#include <bits/stdc++.h>
using namespace std;

int main() {
    string s;
    cin >> s;
    int n = s.size();
    int bestStart = 0, bestLen = 1;
    for (int i = 0; i < n; i++) {
        for (int len = bestLen + 1; i + len <= n; len++) {
            bool ok = true;
            for (int k = 0; k < len / 2; k++) {
                if (s[i + k] != s[i + len - 1 - k]) { ok = false; break; }
            }
            if (ok) { bestStart = i; bestLen = len; }
        }
    }
    cout << bestLen << "\n" << s.substr(bestStart, bestLen) << "\n";
    return 0;
}
