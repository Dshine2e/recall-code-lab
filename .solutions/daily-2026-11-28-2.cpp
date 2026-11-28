#include <bits/stdc++.h>
using namespace std;

int main() {
    string s;
    getline(cin, s);
    if (!s.empty() && s.back() == '\r') s.pop_back();
    for (char &c : s) {
        if (c >= 'a' && c <= 'z') c = 'a' + ('z' - c);
        else if (c >= 'A' && c <= 'Z') c = 'A' + ('Z' - c);
        else if (c >= '0' && c <= '9') c = '0' + ('9' - c);
    }
    cout << s << "\n";
    return 0;
}
