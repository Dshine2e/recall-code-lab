#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    string day;
    cin >> n >> day;
    bool weekend = (day == "WEEKEND");
    long long total = 0;
    for (int i = 0; i < n; i++) {
        int age;
        char member;
        cin >> age >> member;
        int base;
        if (age >= 65) base = 5000;
        else if (age >= 13) base = weekend ? 20000 : 15000;
        else if (age >= 4) base = weekend ? 10000 : 8000;
        else base = 0;
        if (member == 'Y') base = base / 10 * 8;
        total += base;
    }
    cout << total << "\n";
    return 0;
}
