#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    const string special = "!@#$%^&*";
    while (t--) {
        string s;
        cin >> s;
        int n = s.size();
        vector<int> bad;
        if (n < 8 || n > 16) bad.push_back(1);
        bool up = false, lo = false, dg = false, sp = false;
        for (char c : s) {
            if (c >= 'A' && c <= 'Z') up = true;
            else if (c >= 'a' && c <= 'z') lo = true;
            else if (c >= '0' && c <= '9') dg = true;
            else if (special.find(c) != string::npos) sp = true;
        }
        if (up + lo + dg + sp < 3) bad.push_back(2);
        bool same = false, inc = false;
        for (int i = 0; i + 2 < n; i++) {
            if (s[i] == s[i + 1] && s[i + 1] == s[i + 2]) same = true;
            if (isdigit((unsigned char)s[i]) && isdigit((unsigned char)s[i + 1]) && isdigit((unsigned char)s[i + 2]) &&
                s[i + 1] == s[i] + 1 && s[i + 2] == s[i + 1] + 1) inc = true;
        }
        if (same) bad.push_back(3);
        if (inc) bad.push_back(4);
        if (bad.empty()) cout << "OK\n";
        else {
            for (size_t i = 0; i < bad.size(); i++) cout << bad[i] << (i + 1 < bad.size() ? " " : "\n");
        }
    }
    return 0;
}
