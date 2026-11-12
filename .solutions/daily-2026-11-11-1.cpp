#include <bits/stdc++.h>
using namespace std;

int main() {
    int y, m;
    cin >> y >> m;
    bool leap = (y % 400 == 0) || (y % 4 == 0 && y % 100 != 0);
    int days;
    if (m == 2) days = leap ? 29 : 28;
    else if (m == 4 || m == 6 || m == 9 || m == 11) days = 30;
    else days = 31;
    cout << days << '\n';
}
