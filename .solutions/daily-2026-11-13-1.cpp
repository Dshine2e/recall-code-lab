#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        long long x;
        cin >> x;
        if (x == 0) {
            cout << "0 0\n";
            continue;
        }
        string s;
        int ones = 0;
        while (x > 0) {
            int r = x % 2;
            s += char('0' + r);
            ones += r;
            x /= 2;
        }
        reverse(s.begin(), s.end());
        cout << s << ' ' << ones << '\n';
    }
    return 0;
}
