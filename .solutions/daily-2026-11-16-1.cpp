#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        string s;
        cin >> s;
        int steps = 0;
        while (s.size() > 1) {
            long long sum = 0;
            for (char c : s) sum += c - '0';
            s = to_string(sum);
            steps++;
        }
        cout << s << ' ' << steps << '\n';
    }
    return 0;
}
