#include <bits/stdc++.h>
using namespace std;

int main() {
    string first, s;
    getline(cin, first);
    getline(cin, s);
    if (!s.empty() && s.back() == '\r') s.pop_back();
    int k = stoi(first) % 26;
    for (char &c : s) {
        if (c >= 'a' && c <= 'z') c = char('a' + (c - 'a' + k) % 26);
        else if (c >= 'A' && c <= 'Z') c = char('A' + (c - 'A' + k) % 26);
    }
    cout << s << '\n';
    return 0;
}
