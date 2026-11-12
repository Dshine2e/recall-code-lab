#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    string s;
    cin >> n >> s;
    string out;
    int run = 1;
    for (int i = 1; i <= n; i++) {
        if (i < n && s[i] == s[i - 1]) { run++; continue; }
        out += s[i - 1];                 // 묶음이 끝났을 때(마지막 묶음 포함) 기록한다
        if (run > 1) out += to_string(run);
        run = 1;
    }
    cout << out << '\n';
}
