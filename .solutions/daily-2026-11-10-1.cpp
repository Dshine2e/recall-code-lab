#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> odds;
    for (int i = 0; i < n; i++) {
        int x; cin >> x;
        if (x % 2 != 0) odds.push_back(x);   // 음수 홀수는 x % 2 == -1
    }
    if (odds.empty()) { cout << -1 << '\n'; return 0; }
    for (size_t i = 0; i < odds.size(); i++) cout << (i ? " " : "") << odds[i];
    cout << '\n';
}
