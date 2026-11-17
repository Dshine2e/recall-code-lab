#include <bits/stdc++.h>
using namespace std;

long long g(long long a, long long b) { return b == 0 ? a : g(b, a % b); }

int main() {
    int t;
    cin >> t;
    while (t--) {
        long long a, b, d;
        cin >> a >> b >> d;
        long long l = a / g(a, b) * b;
        cout << l << " " << d / l << "\n";
    }
    return 0;
}
