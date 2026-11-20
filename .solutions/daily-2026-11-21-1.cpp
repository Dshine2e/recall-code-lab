#include <bits/stdc++.h>
using namespace std;

int main() {
    int y, n;
    string w;
    cin >> y >> w >> n;
    const string names[7] = {"MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"};
    int first = 0;
    for (int i = 0; i < 7; i++)
        if (names[i] == w) first = i;
    bool leap = (y % 4 == 0 && y % 100 != 0) || y % 400 == 0;
    int days[13] = {0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
    if (leap) days[2] = 29;
    for (int i = 0; i < n; i++) {
        int m, d;
        cin >> m >> d;
        int k = d;
        for (int j = 1; j < m; j++) k += days[j];
        cout << k << ' ' << names[(first + k - 1) % 7] << '\n';
    }
    return 0;
}
