#include <bits/stdc++.h>
using namespace std;
int main() {
    const string D = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    int n; cin >> n;
    while (n--) {
        long long b, c; string s; cin >> b >> s >> c;
        long long v = 0;
        for (char ch : s) v = v * b + (long long)D.find(ch);
        string r;
        if (v == 0) r = "0";
        while (v > 0) { r += D[v % c]; v /= c; }
        reverse(r.begin(), r.end());
        cout << r << "\n";
    }
}
