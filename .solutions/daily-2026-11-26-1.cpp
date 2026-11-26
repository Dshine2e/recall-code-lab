#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> a(n + 1);
    for (int i = 1; i <= n; i++) cin >> a[i];
    int mx = 1, mn = 1;
    for (int i = 2; i <= n; i++) {
        if (a[i] > a[mx]) mx = i;
        if (a[i] <= a[mn]) mn = i;
    }
    cout << mx << ' ' << a[mx] << '\n';
    cout << mn << ' ' << a[mn] << '\n';
    if (a[mx] == a[mn]) cout << "고름\n";
    else cout << abs(mx - mn) << '\n';
    return 0;
}
