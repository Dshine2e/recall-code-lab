#include <bits/stdc++.h>
using namespace std;

int main() {
    string first;
    getline(cin, first);
    int n = stoi(first);
    for (int t = 0; t < n; t++) {
        string line;
        getline(cin, line);
        if (!line.empty() && line.back() == '\r') line.pop_back();
        string s;
        for (char c : line) {
            if (isalnum((unsigned char)c)) s += (char)tolower((unsigned char)c);
        }
        int l = 0, r = (int)s.size() - 1;
        bool ok = true;
        while (l < r) {
            if (s[l] != s[r]) { ok = false; break; }
            l++; r--;
        }
        cout << (ok ? "YES" : "NO") << '\n';
    }
    return 0;
}
