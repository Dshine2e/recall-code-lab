#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    long long total = 0;
    for (int i = 0; i < n; i++) { long long x; cin >> x; total += x; }
    cout << total << '\n';
}
