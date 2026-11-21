#include <bits/stdc++.h>
using namespace std;
int main() {
    int n; cin >> n;
    for (int i = 0; i < n; i++) {
        string s, r; cin >> s;
        bool snake = s.find('_') != string::npos;
        for (size_t j = 0; j < s.size(); j++) {
            char c = s[j];
            if (snake) {
                if (c == '_') { r += (char)toupper(s[j + 1]); j++; }
                else r += c;
            } else {
                if (isupper((unsigned char)c)) { r += '_'; r += (char)tolower(c); }
                else r += c;
            }
        }
        cout << r << "\n";
    }
}
