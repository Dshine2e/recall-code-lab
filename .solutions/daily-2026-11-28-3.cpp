#include <bits/stdc++.h>
using namespace std;

int main() {
    int q;
    cin >> q;
    while (q--) {
        string s;
        cin >> s;
        int steps = 0;
        while (s.size() > 1) {
            int sum = 0;
            for (char c : s) sum += c - '0';
            s = to_string(sum);
            steps++;
        }
        cout << steps << " " << s << "\n";
    }
    return 0;
}
