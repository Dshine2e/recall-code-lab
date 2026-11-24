#include <bits/stdc++.h>
using namespace std;

int main() {
    int t;
    cin >> t;
    while (t--) {
        int s[3];
        cin >> s[0] >> s[1] >> s[2];
        sort(s, s + 3);
        int a = s[0], b = s[1], c = s[2];
        if (a + b <= c) {
            cout << "불가\n";
            continue;
        }
        string angle, side;
        int l = a * a + b * b, r = c * c;
        if (l == r) angle = "직각";
        else if (l < r) angle = "둔각";
        else angle = "예각";
        if (a == c) side = "정삼각형";
        else if (a == b || b == c) side = "이등변";
        else side = "부등변";
        cout << angle << " " << side << "\n";
    }
    return 0;
}
