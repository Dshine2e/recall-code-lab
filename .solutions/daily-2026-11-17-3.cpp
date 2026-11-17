#include <bits/stdc++.h>
using namespace std;

int main() {
    int a, b, k;
    cin >> a >> b >> k;
    vector<int> s(k + 2);
    s[1] = a;
    s[2] = b;
    for (int i = 3; i <= k; i++) s[i] = (s[i - 1] + s[i - 2]) % 1000;
    long long sum = 0;
    for (int i = 1; i <= k; i++) sum += s[i];
    cout << s[k] << "\n" << sum << "\n";
    return 0;
}
