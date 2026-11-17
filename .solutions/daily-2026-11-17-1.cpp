#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    long long g;
    cin >> n >> g;
    long long total = 0;
    int reached = -1;
    for (int day = 1; day <= n; day++) {
        long long p;
        cin >> p;
        total += p;
        if (reached == -1 && total >= g) reached = day;
    }
    cout << total << "\n" << reached << "\n";
    return 0;
}
